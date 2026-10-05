import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { I18nProvider } from './i18n/I18nContext'
import { Layout } from './components/Layout'
import { RequireRole } from './components/RequireRole'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetails } from './pages/ProductDetails'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { Admin } from './pages/Admin'
import { Login } from './pages/Login'
import { UserAccount } from './pages/UserAccount'

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders/:orderId" element={<OrderConfirmation />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="account"
                  element={
                    <RequireRole role="customer">
                      <UserAccount />
                    </RequireRole>
                  }
                />
                <Route
                  path="admin"
                  element={
                    <RequireRole role="admin">
                      <Admin />
                    </RequireRole>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
