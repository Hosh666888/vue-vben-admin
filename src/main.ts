import 'uno.css';
import '@/design/index.less';
import '@/components/VxeTable/src/css/index.scss';
import 'ant-design-vue/dist/reset.css';
// Register icon sprite
import 'virtual:svg-icons-register';

import { createApp } from 'vue';

import { registerGlobComp } from '@/components/registerGlobComp';
import { setupGlobDirectives } from '@/directives';
import { setupI18n } from '@/locales/setupI18n';
import { setupErrorHandle } from '@/logics/error-handle';
import { initAppConfigStore } from '@/logics/initAppConfig';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';

import App from './App.vue';
import {
  AutoComplete,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Menu,
  Modal,
  PageHeader,
  Pagination,
  Popover,
  Progress,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Tree,
  Typography,
  Upload,
} from 'ant-design-vue';


import { injectState, key } from '@/mars3d/common/store/widget';
import store from '@/mars3d/common/store/widget-store';

async function bootstrap() {
  const app = createApp(App);

  // Configure store
  // 配置 store
  setupStore(app);

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app);

  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();



  app.use(AutoComplete);
  app.use(Row);
  app.use(Cascader);
  app.use(Col);
  app.use(Collapse);
  app.use(Button);
  app.use(Select);
  app.use(List);
  app.use(Form);
  app.use(Input);
  app.use(InputNumber);
  app.use(DatePicker);
  app.use(Dropdown);
  app.use(Checkbox);
  app.use(Radio);
  app.use(Switch);
  app.use(Space);
  app.use(Slider);
  app.use(Tree);
  app.use(Upload);
  app.use(Progress);
  app.use(PageHeader);
  app.use(Menu);
  app.use(Popover);
  app.use(Spin);
  app.use(Modal);
  app.use(Typography);
  app.use(Tabs);
  app.use(Tooltip);
  app.use(Divider);
  app.use(Card);
  app.use(Image);
  app.use(Pagination);
  app.use(Table);
  app.use(Empty);

  app.use(injectState(store), key);

  app.mount('#app');
}

bootstrap();
