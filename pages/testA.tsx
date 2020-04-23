import Link from 'next/link'

// function A(){
//   return (<button>A页面</button>)
// }

// export default A;

export default () => (
  <>
    <div>A页面</div>
    <Link href="/testB"><a>前往B页面</a></Link>
  </>
)