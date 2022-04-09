import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Redirect from "../Redirect/Redirect";
import ProductList from "./ProductList";
import { useSearchParams } from "react-router-dom";
import SearchProductList from "./SearchProductList";
import Search from "./Search";
import axios from "axios";
import Footer from "../Footer/Footer";
import { serverUrl } from "../serverurl";

export default function Home({ userData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [items, setItems] = useState([[]]);
  let search = searchParams.get("search");
  useEffect(() => {
    async function getItems() {
      const response = await axios.get(serverUrl + "/getsearchitems", {
        params: { keyword: search, filter: filter },
      });
      setItems(response.data);
    }
    getItems();
    console.log(items);
  }, [filter, sort]);

  function compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  return (
    <>
      <Navbar />

      <div className="container">
        {/* {console.log(items.sort(compareValues("price")))} */}
        {search ? (
          <Search
            filter={filter}
            setFilter={setFilter}
            items={items}
            compareValues={compareValues}
            setItems={setItems}
            setSort={setSort}
          />
        ) : (
          <div>
            <div className="row" style={{backgroundImage: 'url("https://i.ibb.co/TvSZFQ4/Etsy.png")'}}>
              <div className="col-md-4 mt-3 offset-4" >
                <h1 style={{color: "#3a3a3a"}}><br/><br/><br/>Welcome</h1>
                <br/>
                <br/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mt-3">
                <h1>Items</h1>
              </div>
            </div>
          </div>
        )}
        <div className="row mt-1">
          {search ? (
            <SearchProductList
              items={items}
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />
          ) : (
            <ProductList />
          )}
        </div>
      </div>
    </>
  );
}
