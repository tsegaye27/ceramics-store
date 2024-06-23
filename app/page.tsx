import CeramicsList from "./components/CeramicsList";
import SearchBar from "./components/SearchBar";

export default function Home() {
  return (
    <main className="w-full h-[100vh] flex flex-col items-center mt-[2rem]">
      <SearchBar />
      <CeramicsList />
    </main>
  );
}
