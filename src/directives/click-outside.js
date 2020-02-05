const clickOutside = {
  bind: function(el, binding, vNode) {
    const handler = (e) => {
      if (!el.contains(e.target) && el !== e.target) {
        //and here is you toggle var. thats it
        vNode.context[binding.expression] = false;
      }
    };
    el.out = handler;
    document.addEventListener("click", handler);
  },

  unbind: function(el) {
    document.removeEventListener("click", el.out);
    el.out = null;
  }
};

export default {
  clickOutside
};

