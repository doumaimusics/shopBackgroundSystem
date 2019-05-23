/**
 * elementUI 按需引入
 */

import Vue from 'vue'

// 引入需要的组件
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  Checkbox,
  CheckboxGroup,
  Col,
  Container,
  DatePicker,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  Header,
  Icon,
  Input,
  InputNumber,
  Loading,
  Main,
  Menu,
  MenuItem,
  Message,
  MessageBox,
  Notification,
  Option,
  Pagination,
  Popover,
  Radio,
  RadioGroup,
  Row,
  Scrollbar,
  Select,
  Submenu,
  Switch,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Tooltip,
  Upload,
  Steps,
  Step,
  Tag
} from 'element-ui'

// 注册引入的组件
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Card)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Cascader)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Col)
Vue.use(Container)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Icon)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Loading)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Popover)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Row)
Vue.use(Scrollbar)
Vue.use(Select)
Vue.use(Submenu)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(Upload)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tag)

// 注册部分全局方法
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
