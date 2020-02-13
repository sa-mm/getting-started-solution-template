<template>
  <v-container ref="jsonWrapper" fluid />
</template>

<script>
import jsonTree from '@/misc/jsonTree'

export default {
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    const wrapper = this.$refs.jsonWrapper
    const tree = jsonTree.create(this.jsonData, wrapper)
    tree.expand(node => node.parent.isRoot)
  }
}
</script>

<style lang="scss">
.jsontree_tree {
  font-size: 17px;
  @media only screen and (max-width: 600px) {
    font-size: 12px;
    padding-left: 0;
  }
}

.jsontree_child-nodes {
  display: none;
  margin-left: 35px;
  margin-bottom: 5px;
  @media only screen and (max-width: 600px) {
    margin-left: 10px;
  }
}
.jsontree_node_expanded
  > .jsontree_value-wrapper
  > .jsontree_value
  > .jsontree_child-nodes {
  display: block;
}

/* Styles for labels */
.jsontree_label-wrapper {
  float: left;
  margin-right: 8px;
  @media only screen and (max-width: 600px) {
    margin-left: 4px;
  }
}
.jsontree_label {
  font-weight: normal;
  vertical-align: top;
  color: #000;
  position: relative;
  padding: 1px;
  border-radius: 4px;
  cursor: default;
}

.jsontree_node_marked > .jsontree_label-wrapper > .jsontree_label {
  background: #fff2aa;
}

/* Styles for values */
.jsontree_value-wrapper {
  display: block;
  overflow: hidden;
}
.jsontree_node_complex > .jsontree_value-wrapper {
  overflow: inherit;
}
.jsontree_value {
  vertical-align: top;
  display: inline;
}
.jsontree_value_null {
  color: #777;
  font-weight: 500;
}
.jsontree_value_string {
  color: #025900;
  font-weight: 500;
}
.jsontree_value_number {
  color: #000e59;
  font-weight: 500;
}
.jsontree_value_boolean {
  color: #600100;
  font-weight: 500;
}

/* Styles for active elements */
.jsontree_expand-button {
  position: absolute;
  top: 3px;
  left: -15px;
  display: block;
  width: 11px;
  height: 11px;
  background-image: url('/../static/other/jsonTree.svg');
}
.jsontree_node_expanded
  > .jsontree_label-wrapper
  > .jsontree_label
  > .jsontree_expand-button {
  background-position: 0 -11px;
}
.jsontree_show-more {
  cursor: pointer;
}
.jsontree_node_expanded
  > .jsontree_value-wrapper
  > .jsontree_value
  > .jsontree_show-more {
  display: none;
}
.jsontree_node_empty
  > .jsontree_label-wrapper
  > .jsontree_label
  > .jsontree_expand-button,
.jsontree_node_empty
  > .jsontree_value-wrapper
  > .jsontree_value
  > .jsontree_show-more {
  display: none !important;
}
.jsontree_node_complex > .jsontree_label-wrapper > .jsontree_label {
  cursor: pointer;
}
.jsontree_node_empty > .jsontree_label-wrapper > .jsontree_label {
  cursor: default !important;
}
ul {
  list-style: none;
}
</style>
