module: {
  loaders: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
  ],
  preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" },
  ]
}
