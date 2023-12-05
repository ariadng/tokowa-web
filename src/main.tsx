import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/index.scss';
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
	onNeedRefresh() {
		if (confirm("New content available. Reload?")) {
			updateSW(true);
		}
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
