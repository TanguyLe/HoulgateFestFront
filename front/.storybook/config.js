import { configure } from "@storybook/react";

/////////////////////////////////////////////////////////////////////////////////////////////
// Match __stories__ folders
const req = require.context("../stories/", true, /.*.*\.js$/);
function loadStories() {
	req.keys().forEach(req);
}
configure(loadStories, module);
