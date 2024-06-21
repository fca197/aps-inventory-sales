<!-- tinymc富文本 -->
<template>
  <div>
    <editor
        v-model="myValue"
        :init="init"
        :disabled="disabled"
        @onClick="onClick"
    >
    </editor>
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";

export default {
  name: "tinymce",
  components: {
    Editor,
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
      // ' anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists   noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
         //image media table

          "lists wordcount ",
    },
    toolbar: {
      type: [String, Array],
      default:
      // 'undo redo | searchreplace | bold  italic | underline | strikethrough | alignleft  aligncenter alignright | outdent indent  blockquote  removeformat subscript superscript code codesample hr bullist numlist link image charmap preview anchor pagebreak insertdatetime  table  forecolor backcolor'
          "undo redo |  formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat hr",
    },
  },
  data() {
    return {
      //初始化配置
      init: {

        language: "zh_CN",
        height: 500,
        width:1200,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: true,
        menubar: true,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        },
        resize: true,
      },
      myValue: this.value,
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>
<style scoped></style>
