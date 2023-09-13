import { UserProvider } from "./context/UserContext";
import IndexFooter from "./components/IndexFooter/IndexFooter";
import HomePage from "./pages/HomePage";
import "./index.css";

function App() {
  return (
    <UserProvider>
      <div>
        <HomePage />
        <IndexFooter />
      </div>
    </UserProvider>
  );
}
//
export default App;
