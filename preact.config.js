export default (config) => {
  config.output.publicPath = "./";
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    use: "file-loader",
  });
};
