module.exports = {
    parser: 'postcss-scss',
    plugins: [
        ...(process.env.JEKYLL_ENV != "development"
            ? [
                require("autoprefixer"),
                require("@fullhuman/postcss-purgecss")({
                    content: ["./_site/**/*.html"],
                    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
                })
            ]
            : []),
    ],
};