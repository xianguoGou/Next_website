
import axios from 'axios'
import '../static/test.css'
import {Button, Layout, Menu, Breadcrumb, Spin } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import Link from 'next/link'
import React, {useState} from 'react'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import Map from '../components/Map'
type Props = {
  items: {
    id: number,
    img: string
  }
}
const Home = ({ items }: Props) => {
  const [ count , setCount ] = useState(0)
  console.log('接口返回data数据:', items)
  return (
    <>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <UserOutlined />
                    subnav 1
                  </span>
                }
              >
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <LaptopOutlined />
                    subnav 2
                  </span>
                }
              >
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <NotificationOutlined />
                    subnav 3
                  </span>
                }
              >
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Spin spinning={false}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div>这是首页</div>
              <Link href="/testA">
                <Button>前往A页面</Button>
              </Link>
              <Button type="primary" loading={false} onClick={()=>{setCount(count+1)}}>
                Click me!
              </Button>
              <div>{count}</div>
              <Map name={'mapComponent'}/>
              <style jsx>
                {`
                    div{color:blue;}
                `}
              </style>
            </Content>
            </Spin>
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}

Home.getInitialProps = async () => {
  const items = await axios('http://rap2.taobao.org:38080/app/mock/177412/rap/random/list/').then(res => {
    return res.data.list_body.list_product
  })
  return { items }
}

export default Home;