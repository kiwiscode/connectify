import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <UserProvider>
      <div>
        <Navbar />
        <HomePage />
        <Footer />
      </div>
    </UserProvider>
  );
}
//
export default App;
