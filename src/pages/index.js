import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Showcase from "../components/showcase"
import Layout from "../components/layout"
import Seo from "../components/seo"
import ThemeToggler from "gatsby-plugin-dark-mode/ThemeToggler"
import { useEffect } from "react"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  useEffect(() => {
    window.__setPreferredTheme('dark');
  },[]);

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No blog posts found.
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      <Showcase />

      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <DateAndReadTime post={post} />
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

const DateAndReadTime = ({post}) => {
  return (
    <span>
      <small>{post.frontmatter.date}</small>
      { post.fields.slug !== '/resume/' ?
        (<small>
          &nbsp;·&nbsp;
          {getEmojis(post.fields.readingTime.minutes)}
          &nbsp;
          {post.fields.readingTime.text}
      </small>) : null }
    </span>
  )
}

function getEmojis(minutes) {
  const numEmojis = Math.floor(minutes/5)+1;
  return '☕'.repeat(numEmojis);
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
          readingTime {
            minutes
            text
          }
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
