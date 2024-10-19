import { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <ToastContainer />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;