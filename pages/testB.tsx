import Link from 'next/link'
export default () => (
  <>
    <div>B页面</div>
    <Link href="/testA"><a>返回 A 页面</a></Link>
    <div>
    <Link href="/"><a>返回首页</a></Link>
    </div>
  </>
)