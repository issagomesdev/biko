import type { Category, City } from "./api"

export interface PublicationAuthor {
  id:               number
  name:             string
  username:         string
  avatar:           { url: string; thumb_url: string } | null
  cover:            { url: string; thumb_url: string } | null
  categories:       Category[]
  city:             City | null
  is_online:        boolean
  is_private:       boolean
  followers_count:  number
  following_count:  number
  average_rating:   number | null
  reviews_count:    number
  is_following:     boolean
  is_blocked:       boolean
}

export interface PublicationMedia {
  id:        number
  url:       string
  thumb_url: string
  type:      "image" | "video"
  mime_type: string
}


export interface CommentAuthor {
  id:       number
  name:     string
  username: string
  avatar:   { url: string; thumb_url: string } | null
}

export interface Comment {
  id:          number
  comment:     string
  parent_id:   number | null
  author:      CommentAuthor
  media:       PublicationMedia[]
  replies:     Comment[]
  likes_count: number
  is_liked:    boolean
  created_at:  string
}

export interface Publication {
  id:             number
  text:           string
  type:           0 | 1        // 0 = CLIENT, 1 = PROVIDER
  author:         PublicationAuthor
  city:           City | null
  categories:     Category[]
  tags:           string[]
  mentions:       { id: number; username: string }[]
  media:          PublicationMedia[]
  is_liked:       boolean
  likes_count:    number
  comments_count: number
  comments?:      Comment[]
  created_at:     string
  updated_at:     string
}

export type FeedOrderBy = "desc" | "asc" | "popular"

export interface FeedFilters {
  search:     string
  type:       0 | 1 | null
  categories: number[]
  state_id:   number | null
  city_id:    number | null
  date:       string          // "today" | "last_24h" | "last_7d" | "last_30d" | ""
  orderBy:    FeedOrderBy
}
