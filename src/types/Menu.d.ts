interface MenuItem {
  name: string
  action?: Function
  children?: MenuItem[]
  open?: boolean
}
