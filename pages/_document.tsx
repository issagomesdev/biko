// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="icon" type="image/x-icon" href="/midia/icon.png"/>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
                />
                <title>BIKO</title>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
