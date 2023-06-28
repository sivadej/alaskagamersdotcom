import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link href='https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.css' rel='stylesheet' />
                    <link href='https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.13.1/css/all.css' rel='stylesheet' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;