import type { PlaceSearchResult } from "@/src/domain/places";

import type {
  PlaceSearchOptions,
  PlaceSearchProvider
} from "@/src/application/places/types";

type SeedPlace = Omit<PlaceSearchResult, "source"> & {
  keywords: string[];
};

const seedPlaces: SeedPlace[] = [
  {
    id: "seed:danang-golden-bridge",
    keywords: ["golden bridge", "da nang", "vietnam", "bridge"],
    name: "Golden Bridge (Cầu Vàng)",
    address: "Bà Nà Hills, Hòa Vang, Da Nang, Vietnam",
    lat: 15.9909,
    lng: 107.9962,
    category: "landmark",
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Golden+Bridge+Da+Nang",
    imageUrl:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=520&q=85"
  },
  {
    id: "seed:danang-my-khe",
    keywords: ["my khe", "beach", "da nang", "swim"],
    name: "My Khe Beach",
    address: "Trường Sa, Da Nang, Vietnam",
    lat: 16.0471,
    lng: 108.2471,
    category: "beach",
    externalUrl: "https://www.google.com/maps/search/?api=1&query=My+Khe+Beach",
    imageUrl:
      "https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=520&q=85"
  },
  {
    id: "seed:danang-dragon-bridge",
    keywords: ["dragon bridge", "da nang", "river", "fire"],
    name: "Dragon Bridge",
    address: "Nguyễn Văn Linh, Da Nang, Vietnam",
    lat: 16.0611,
    lng: 108.2223,
    category: "landmark",
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Dragon+Bridge+Da+Nang",
    imageUrl:
      "https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?auto=format&fit=crop&w=520&q=85"
  },
  {
    id: "seed:kyoto-fushimi",
    keywords: ["fushimi", "inari", "kyoto", "shrine", "torii"],
    name: "Fushimi Inari Shrine",
    address: "68 Fukakusa Yabunouchichō, Fushimi, Kyoto, Japan",
    lat: 34.9671,
    lng: 135.7727,
    category: "shrine",
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Fushimi+Inari",
    imageUrl:
      "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?auto=format&fit=crop&w=520&q=85"
  },
  {
    id: "seed:kyoto-arashiyama",
    keywords: ["arashiyama", "bamboo", "kyoto", "grove"],
    name: "Arashiyama Bamboo Grove",
    address: "Sagatenryūji, Ukyō, Kyoto, Japan",
    lat: 35.0173,
    lng: 135.6717,
    category: "nature",
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Arashiyama+Bamboo+Grove",
    imageUrl:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=520&q=85"
  },
  {
    id: "seed:bali-uluwatu",
    keywords: ["uluwatu", "bali", "temple", "cliff", "surf"],
    name: "Uluwatu Temple",
    address: "Pecatu, Badung, Bali, Indonesia",
    lat: -8.8294,
    lng: 115.0844,
    category: "temple",
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Uluwatu+Temple",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=520&q=85"
  },
  {
    id: "seed:bali-ubud-monkey",
    keywords: ["ubud", "monkey", "bali", "forest", "sacred"],
    name: "Sacred Monkey Forest Sanctuary",
    address: "Ubud, Gianyar, Bali, Indonesia",
    lat: -8.5189,
    lng: 115.2585,
    category: "nature",
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Sacred+Monkey+Forest+Ubud",
    imageUrl:
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=520&q=85"
  }
];

function matches(seed: SeedPlace, normalizedQuery: string, tokens: string[]) {
  if (!normalizedQuery) {
    return true;
  }

  if (seed.name.toLowerCase().includes(normalizedQuery)) {
    return true;
  }

  if (seed.address?.toLowerCase().includes(normalizedQuery)) {
    return true;
  }

  if (seed.keywords.some((keyword) => keyword.includes(normalizedQuery))) {
    return true;
  }

  return tokens.every((token) =>
    [seed.name, seed.address ?? "", ...seed.keywords]
      .join(" ")
      .toLowerCase()
      .includes(token)
  );
}

export function createSeedPlaceSearchProvider(): PlaceSearchProvider {
  return {
    source: "seed",
    async searchPlaces(query, options: PlaceSearchOptions) {
      const normalized = query.trim().toLowerCase();
      const tokens = normalized.split(/\s+/).filter(Boolean);
      const limit = options.limit ?? 20;

      return seedPlaces
        .filter((seed) => matches(seed, normalized, tokens))
        .slice(0, limit)
        .map(
          ({ keywords: _keywords, ...rest }): PlaceSearchResult => ({
            ...rest,
            source: "seed"
          })
        );
    }
  };
}
