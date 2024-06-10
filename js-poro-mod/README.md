# JS Poro Mod

This project is a lightweight web mod with a modern Material Design UI. It includes screens for rolling features, managing account data, and importing/exporting data.

## Structure

-   `assets/`: Contains static assets like images and stylesheets.
-   `js/`: Contains JavaScript files for different components and features.
-   `index.html`: Main HTML file for the popup.
-   `README.md`: Documentation for the project.

## Usage

1. Change to the correct dir!
   `cd js-poro-mod`

2. Install:
   `npm init -y`
   `npm install webpack@latest webpack-cli@latest css-minimizer-webpack-plugin@latest terser-webpack-plugin@latest clean-webpack-plugin@latest css-loader@latest style-loader@latest raw-loader@latest --save-dev`

3. Compile to single file:
   `npx webpack --config webpack.config.js`
