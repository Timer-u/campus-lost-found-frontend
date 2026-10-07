// 分类/状态的取值与后端 controller 的 oneof 校验保持一致
export const CATEGORY_OPTIONS = [
  { value: 'id_card', label: '证件卡类' },
  { value: 'wallet', label: '钱包' },
  { value: 'phone', label: '手机/耳机' },
  { value: 'computer', label: '电脑/平板' },
  { value: 'book', label: '书籍' },
  { value: 'clothing', label: '衣物' },
  { value: 'key', label: '钥匙' },
  { value: 'daily', label: '日用品' },
  { value: 'other', label: '其他' },
]

export const CATEGORY_TEXT: Record<string, string> = {
  id_card: '证件卡类',
  wallet: '钱包',
  phone: '手机/耳机',
  computer: '电脑/平板',
  book: '书籍',
  clothing: '衣物',
  key: '钥匙',
  daily: '日用品',
  other: '其他',
}

export const ITEM_STATUS_OPTIONS = [
  { value: 'open', label: '开放中' },
  { value: 'claimed', label: '已认领' },
  { value: 'resolved', label: '已解决' },
  { value: 'closed', label: '已关闭' },
]

export const ITEM_STATUS_TEXT: Record<string, string> = {
  open: '开放中',
  claimed: '已认领',
  resolved: '已解决',
  closed: '已关闭',
}