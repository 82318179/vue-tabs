<script>
export default {
  name: "render-temp",
  props: {
    renders: {
      type: Function,
      default: () => {}
    },
    params: {
      type: String,
      default: ""
    }
  },
  render(createElement) {
    return this.renders(createElement, this.params);
  }

  //   render: function (createElement) {
  //   return createElement('h1', this.blogTitle)
  // }
};
</script>