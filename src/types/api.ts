export type ItemType = 'lost' | 'found'
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'offline'
export type ItemStatus = 'open' | 'claimed' | 'resolved' | 'closed'

export interface PageMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface Item {
  id: number
  type: ItemType
  title: string
  description: string
  category: string
  location: string
  contact: string
  imageUrls: string[]
  reviewStatus: ReviewStatus
  rejectReason?: string
  itemStatus: ItemStatus
  publisherId: number
  publisherName: string
  createdAt: string
  updatedAt: string
}

export interface ItemListQuery {
  page: number
  pageSize: number
  keyword?: string
  type?: ItemType
  category?: string
  itemStatus?: ItemStatus
  location?: string
  sort?: 'latest' | 'oldest'
}

export interface ItemListResult {
  items: Item[]
  meta: PageMeta
}

export interface UploadResult {
  url: string
}