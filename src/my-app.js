import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
	static get template() {
		return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

            <a name="view1" href="[[rootPath]]view1">View One</a>
            <a name="view2" href="[[rootPath]]view2">View Two</a>
            <a name="view3" href="[[rootPath]]view3">View Three</a>
            <a name="new-view" href="[[rootPath]]new-view">New View</a>
    `;
	}

	static get properties() {
		return {
			page: {
				type: String,
				reflectToAttribute: true,
				observer: '_pageChanged'
			},
			routeData: Object,
			subroute: Object
		};
	}

	static get observers() {
		return ['_routePageChanged(routeData.page)'];
	}

	_routePageChanged(page) {
		// Show the corresponding page according to the route.
		//
		// If no page was found in the route data, page will be an empty string.
		// Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
		if (!page) {
			this.page = 'view1';
		} else if (['view1', 'view2', 'view3', 'new-view'].indexOf(page) !== -1) {
			this.page = page;
		} else {
			this.page = 'view404';
		}
	}

	_pageChanged(page) {
		// Import the page component on demand.
		//
		// Note: `polymer build` doesn't like string concatenation in the import
		// statement, so break it up.
		switch (page) {
			case 'view1':
				import('./my-view1.js');
				break;
			case 'view2':
				import('./my-view2.js');
				break;
			case 'view3':
				import('./my-view3.js');
				break;
			case 'new-view':
				import('./my-new-view.js');
				break;
			case 'view404':
				import('./my-view404.js');
				break;
		}
	}
}

window.customElements.define('my-app', MyApp);
