import "../styles/globals.css"
import type { AppProps } from "next/app"
import "bootstrap/dist/css/bootstrap.min.css"
import { AnimatePresence } from "framer-motion"
import { ThemeProvider } from "next-themes"
import { Provider } from "react-redux"
import { persistor, store } from "../redux/store"
import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"
import { PersistGate } from "redux-persist/integration/react"

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <div className="colorpage">
      <AnimatePresence exitBeforeEnter>
        <ThemeProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {getLayout(<Component {...pageProps} />)}
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </AnimatePresence>
    </div>
  )
}

export default MyApp
