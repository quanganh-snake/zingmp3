import React, { useState, useRef, useEffect } from "react";
import IonIcon from "@reacticons/ionicons";
import { DebounceInput } from "react-debounce-input";
import SearchSuggest from "./SearchSuggest";

import useClient from "./../../../Services/Hooks/useClient";

export default function SearchForm() {
	const [isHide, setHide] = useState(true);
	const [songs, setSongs] = useState([]);
	const [suggests, setSuggests] = useState([]);
	const [trending, setTrending] = useState([]);
	const [keywords, setKeywords] = useState("");
	const inputRef = useRef();
	const client = useClient();

	useEffect(() => {
		getTranding();
	}, []);

	const getSongs = async (keywords) => {
		if (keywords !== "") {
			const songs = await client.get("/songs", { q: keywords });
			setSongs(songs);
		} else {
			setSongs([]);
		}
	};

	const getSuggests = async (keywords) => {
		if (keywords !== "") {
			const suggests = await client.get("/keywords", { q: keywords });
			setSuggests(suggests);
		} else {
			setSuggests([]);
		}
	};

	const handleFocusSearch = (status) => {
		const time = !status ? 0 : 500;
		setTimeout(() => {
			setHide(status);
		}, time);
	};

	const handleSearch = (e) => {
		const keywords = e.target.value;
		getSongs(keywords);
		getSuggests(keywords);
		setKeywords(keywords);
	};

	const postKeywords = async (keywords) => {
		console.log(keywords);
		await client.post(client.keywords, {
			keyword: keywords,
		});
	};

	const handlePostKeywords = () => {
		if (keywords !== "") {
			postKeywords(keywords);
		}
	};

	const getTranding = async () => {
		const res = await client.get(client.trending_search);
		setTrending(res.data);
	};

	return (
		<div className="zing-search">
			<div className="search-icon color-main">
				<IonIcon name="search-outline" role="img" className="md hydrated" aria-label="search outline" />
			</div>
			<DebounceInput
				debounceTimeout={300}
				element={"input"}
				ref={inputRef}
				onFocus={() => {
					handleFocusSearch(false);
				}}
				onBlur={() => {
					handleFocusSearch(true);
				}}
				onChange={handleSearch}
				className="color-main"
				placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
			/>
			{/* ------------------------- */}
			<SearchSuggest isHide={isHide} songs={songs} suggests={suggests} trending={trending} onPostKeywords={handlePostKeywords} />
		</div>
	);
}
