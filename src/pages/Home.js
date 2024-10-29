import '../App.css';
import SearchBuilding from '../components/SearchBuilding';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <SearchBuilding initialBuilding={""}></SearchBuilding>
      </header>
    </div>
  );
}

export default Home;
