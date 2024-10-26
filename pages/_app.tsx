import { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import '../styles/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <ToastContainer />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;