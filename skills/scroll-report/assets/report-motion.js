/* GSAP helpers for narrated HTML reports. No bundler required. */
(function (global) {
  "use strict";
  const elements = (value) => Array.from(value);
  function animate(target, vars, signal) {
    if (signal?.aborted) return Promise.resolve();
    return new Promise((resolve) => {
      let tween;
      const finish = () => {
        signal?.removeEventListener("abort", cancel);
        resolve();
      };
      const cancel = () => { tween?.kill(); finish(); };
      tween = global.gsap.to(target, { ...vars, onComplete: finish, onInterrupt: finish });
      signal?.addEventListener("abort", cancel, { once: true });
    });
  }
  function gestureRouter(resolve, { cooldown = 400 } = {}) {
    let busy = false, destroyed = false, timer, startY = null, controller;
    function consume(direction, event) {
      if (destroyed || !direction) return;
      if (busy) {
        event.preventDefault();
        return;
      }
      const task = resolve(direction);
      if (typeof task !== "function") return;
      event.preventDefault();
      busy = true;
      controller = new AbortController();
      Promise.resolve().then(() => task(controller.signal)).catch((error) => {
        if (!destroyed) console.error("Report transition failed", error);
      }).finally(() => {
        if (!destroyed) timer = setTimeout(() => { busy = false; }, cooldown);
      });
    }
    function wheel(event) {
      if (event.defaultPrevented || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      consume(Math.sign(event.deltaY), event);
    }
    function key(event) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey ||
          event.target.closest?.("input,textarea,select,button,a,[contenteditable]")) return;
      const direction = ["ArrowDown", "PageDown"].includes(event.key) ? 1
        : ["ArrowUp", "PageUp"].includes(event.key) ? -1
        : event.key === " " ? (event.shiftKey ? -1 : 1) : 0;
      consume(direction, event);
    }
    function touchStart(event) {
      startY = event.touches.length === 1 ? event.touches[0].clientY : null;
    }
    function touchMove(event) {
      if (event.touches.length !== 1 || startY === null) return;
      const delta = startY - event.touches[0].clientY;
      if (Math.abs(delta) < 14) return;
      consume(Math.sign(delta), event);
      if (event.defaultPrevented) startY = event.touches[0].clientY;
    }
    function touchEnd() { startY = null; }
    global.addEventListener("wheel", wheel, { passive: false });
    global.addEventListener("keydown", key);
    global.addEventListener("touchstart", touchStart, { passive: true });
    global.addEventListener("touchmove", touchMove, { passive: false });
    global.addEventListener("touchend", touchEnd);
    return {
      get busy() { return busy; },
      destroy() {
        destroyed = true;
        controller?.abort();
        clearTimeout(timer);
        global.removeEventListener("wheel", wheel);
        global.removeEventListener("keydown", key);
        global.removeEventListener("touchstart", touchStart);
        global.removeEventListener("touchmove", touchMove);
        global.removeEventListener("touchend", touchEnd);
      },
    };
  }
  async function scrollToElement(element, seconds = 1.3, signal) {
    const position = { y: global.scrollY };
    const target = element.getBoundingClientRect().top + position.y;
    await animate(position, {
      y: target, duration: seconds, ease: "sine.inOut",
      onUpdate: () => global.scrollTo(0, position.y),
    }, signal);
  }
  function slides(input, initial = 0, seconds = 1.1) {
    const cards = elements(input);
    let index = initial;
    const update = () => cards.forEach((card, i) => {
      card.setAttribute("aria-hidden", String(i !== index));
      card.inert = i !== index;
    });
    global.gsap.set(cards, { xPercent: 108, opacity: 0.25 });
    global.gsap.set(cards[index], { xPercent: 0, opacity: 1 });
    update();
    return {
      get index() { return index; },
      async show(next, duration = seconds, signal) {
        if (next === index || next < 0 || next >= cards.length || signal?.aborted) return;
        const previous = index, direction = Math.sign(next - index);
        index = next;
        global.gsap.set(cards[next], { xPercent: direction * 108, opacity: 0.25 });
        update();
        await Promise.all([
          animate(cards[previous], { xPercent: -direction * 108, opacity: 0.25, duration, ease: "sine.inOut" }, signal),
          animate(cards[next], { xPercent: 0, opacity: 1, duration, ease: "sine.inOut" }, signal),
        ]);
      },
      destroy() {
        global.gsap.set(cards, { clearProps: "transform,opacity" });
        cards.forEach((card) => { card.removeAttribute("aria-hidden"); card.inert = false; });
      },
    };
  }
  async function focus(input, index, seconds = 0.9, signal) {
    const items = elements(input);
    await Promise.all(items.map((item, i) => animate(item, {
      opacity: index < 0 || i === index ? 1 : 0.18,
      duration: seconds, ease: "sine.inOut",
    }, signal)));
  }
  function expandGrid(grid) {
    const originals = elements(grid.children);
    let overlay = null, source = null;
    const bounds = (card) => ({
      x: card.offsetLeft, y: card.offsetTop,
      width: card.offsetWidth, height: card.offsetHeight,
      padding: getComputedStyle(card).padding,
    });
    return {
      async show(index, seconds = 1.2, signal) {
        if (signal?.aborted) return;
        if (overlay) {
          const old = overlay;
          await animate(old, { ...bounds(source), duration: seconds, ease: "sine.inOut" }, signal);
          old.remove();
          if (overlay === old) overlay = null;
        }
        if (index < 0 || signal?.aborted) return;
        source = originals[index];
        if (!source) return;
        overlay = source.cloneNode(true);
        overlay.removeAttribute("id");
        overlay.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        overlay.classList.add("report-expanded");
        overlay.setAttribute("aria-hidden", "true");
        overlay.inert = true;
        grid.append(overlay);
        global.gsap.set(overlay, { ...bounds(source) });
        await animate(overlay, {
          x: 0, y: 0, width: grid.clientWidth, height: grid.clientHeight,
          padding: Math.min(56, grid.clientHeight * 0.09),
          duration: seconds, ease: "sine.inOut",
        }, signal);
      },
      destroy() { overlay?.remove(); overlay = null; },
    };
  }
  function fitBox(view, box, padding = 30) {
    const scale = Math.min(view.width / (box.width + padding * 2), view.height / (box.height + padding * 2));
    return {
      scale,
      x: view.x + view.width / 2 - (box.x + box.width / 2) * scale,
      y: view.y + view.height / 2 - (box.y + box.height / 2) * scale,
    };
  }
  function diagram(svg, camera, targets, padding = 30) {
    const state = { x: 0, y: 0, scale: 1 };
    const render = () => camera.setAttribute("transform", `translate(${state.x} ${state.y}) scale(${state.scale})`);
    const originalTransform = camera.getAttribute("transform");
    return {
      async show(index, seconds = 1.1, signal) {
        const target = index === null ? { x: 0, y: 0, scale: 1 }
          : fitBox(svg.viewBox.baseVal, targets[index].getBBox(), padding);
        await animate(state, { ...target, duration: seconds, ease: "sine.inOut", onUpdate: render }, signal);
      },
      destroy() {
        if (originalTransform === null) camera.removeAttribute("transform");
        else camera.setAttribute("transform", originalTransform);
      },
    };
  }
  global.ReportMotion = { gestureRouter, scrollToElement, slides, focus, expandGrid, diagram, fitBox };
})(globalThis);
