import * as React from "react"
const ToC = ({ headings }) => (
    <div id='toc' style={{ paddingBottom: '64px' }}>
      <h2>Table of contents</h2>
      <div>
        {headings.map(heading => {
          if (heading.depth > 4) {
            return <div />
          }
  
          return (
            <li key={heading.value}>
              <a
                href={`#${heading.value.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {heading.value}
              </a>
            </li>
          )
        })}
      </div>
    </div>
  )

//   const Toc = styled.ul`
//   ${tw`bg-white fixed hidden lg:flex flex-col rounded p-3 my-3`};
//   width: 20rem;
//   left: calc(50% + 400px);
//   top: 80px;
//   max-height: 30vh;
// `

//const Title = tw.h2`text-2xl mb-2`

//const ToCElement = tw.li`p-1 leading-5 ml-4 mb-4 mr-4 leading-3 list-none`

//const ToCLink = tw.a`hover:text-black transition duration-300 no-underline`

// const InnerScroll = styled.div`
//   scrollbar-width: thin;
//   scrollbar-color: #367ee9 rgba(48, 113, 209, 0.3);
//   overflow: hidden auto;
// `

  export default ToC
