import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import Loading from './components/Loading';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

let persistor = persistStore(store);

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={<Loading />} persistor={persistor}>
			<ConfigProvider locale={vi_VN}>
				<App />
			</ConfigProvider>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);
