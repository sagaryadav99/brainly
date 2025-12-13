import { Dashboard } from "./pages/dashboard";
import "./App.css";
import { SignIn } from "./pages/signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Landing } from "./pages/landing";
import { Accounts } from "./pages/accounts";
import { MytweetComp } from "./components/twittercom";
const queryclient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryclient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Accounts />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/cards" element={<Dashboard />} />
          <Route path="/" element={<Landing />} />
          <Route path="/account" element={<Accounts />} />
          <Route
            path="/test"
            element={
              <MytweetComp id={"1998671506784547309"} variant={"bigcard"} />
            }
          />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
