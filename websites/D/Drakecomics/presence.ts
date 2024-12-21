const presence = new Presence({
	clientId: "1319951896114630756",
}),
timePassed = Math.floor(Date.now() / 1e3);

const enum Assets {
	Logo = "https://drakecomic.org/wp-content/uploads/2024/04/dragonlogo.png",
}

presence.on("UpdateData", async () => {
	const { pathname, search } = window.location,
	 presenceData: PresenceData = {
		largeImageKey: Assets.Logo,
		startTimestamp: timePassed,
		name: "Drakecomic.org",
	};

	if (pathname === "/") {
		presenceData.details = "Home page";
		presenceData.state = "Browsing the site";

	}	else if (pathname.split("/")[1] === "manga") {
		if (pathname === "/manga/") {
			presenceData.details = "Browsing the Comic collection";
			presenceData.state = "The vast world.";

		} else if (!pathname.includes("chapter")) {

			presenceData.details = `Viewing ${pathname.split("/")[2]
				.replace(/-/g, " ")
				.replace(/\b\w/g, c => c.toUpperCase())}`;
			presenceData.state = "Browsing comic details";

		} else if (search.includes("order=")) {
			const orderMatch = search.match(/order=([^&]+)/);
			if (orderMatch) {
				const orderType = orderMatch[1],
					pageMatch = search.match(/page=(\d+)/);
				presenceData.details = "Browsing all comics";
				presenceData.state = `On Page ${pageMatch ? pageMatch[1] : "1"} (Sorted by ${orderType.charAt(0).toUpperCase() + orderType.slice(1)})`;
			}
		}

	}	else if (pathname.includes("list-mode")) {
		presenceData.details = "Browsing all comics";
		presenceData.state = "List Mode";

	}	else {
		const titleElement = document.querySelector<HTMLHeadingElement>("h1.entry-title");

		if (!titleElement) {
			const intervalId = setInterval(() => {
				const titleElement = document.querySelector<HTMLHeadingElement>("h1.entry-title");

				if (titleElement) {
					clearInterval(intervalId);
					presenceData.details = `Viewing: ${titleElement.textContent?.trim() || "Unknown Title"}`;
					presenceData.state = "Browsing comic details";
					presence.setActivity(presenceData);
				}
			}, 500);
		} else {
			presenceData.details = `Viewing: ${titleElement.textContent?.trim() || "Unknown Title"}`;
			presenceData.state = "Browsing comic details";
		}
	}

	if (pathname.includes("chapter")) {
		const titleMatch = pathname.match(/\/([^/]+)-chapter-\d+\//),
			chapterMatch = pathname.match(/chapter-(\d+)/),
			comicTitle = titleMatch
				? titleMatch[1]
					.replace(/-/g, " ")
					.replace(/\b\w/g, c => c.toUpperCase())
				: "Unknown Comic";

		presenceData.details = `Reading: ${comicTitle}`;
		presenceData.state = `Chapter ${chapterMatch ? chapterMatch[1] : "Unknown Chapter"}`;
	} else if (pathname.includes("bookmark")) {
		presenceData.details = "Viewing Bookmarks";
		presenceData.state = "Browsing comic bookmarks";
	} else if (pathname.includes("/page/")) {
		const pageMatch = pathname.match(/\/page\/(\d+)/);
		presenceData.details = "Browsing pages";
		presenceData.state = `On Page ${pageMatch ? pageMatch[1] : "Unknown Page"}`;
	}

	presence.setActivity(presenceData);
});
