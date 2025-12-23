import { Dashboard } from "./pages/dashboard";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Landing } from "./pages/landing";
import { Accounts } from "./pages/accounts";
const queryclient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryclient}>
      <BrowserRouter>
        <Routes>
          <Route path="/cards" element={<Dashboard />} />
          <Route path="/" element={<Landing />} />
          <Route path="/account" element={<Accounts />} />
          <Route path="brainshare/:shareId" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
