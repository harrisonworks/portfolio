const siteURL = process.env.API_URL

export const state = () => ({
  posts: [],
  tags: [],
  windowHeight: null,
})

export const mutations = {
  updatePosts: (state, posts) => {
    state.posts = posts
  },
  updateTags: (state, tags) => {
    console.log('in mutation', tags)
    state.tags = tags
  },
  updateHeight: (state, payload) => {
    state.windowHeight = payload
  },
}

export const actions = {
  async getPosts({ state, commit, dispatch }) {
    if (state.posts.length) return

    try {
      let posts = await fetch(
        `${siteURL}/wp-json/wp/v2/posts?page=1&per_page=20&_embed=1`
      ).then((res) => res.json())
      // console.log(posts)
      posts = posts
        .filter((el) => el.status === 'publish')
        .map(({ id, slug, title, excerpt, date, tags, content, acf }) => ({
          id,
          slug,
          title,
          excerpt,
          date,
          tags,
          content,
          acf,
        }))

      commit('updatePosts', posts)
    } catch (err) {
      console.log(err)
    }
  },
  // currently inactive
  async getTags({ state, commit }) {
    if (state.tags.length) return

    let allTags = state.posts.reduce((acc, item) => {
      return acc.concat(item.tags)
    }, [])
    allTags = allTags.join()

    // console.log(allTags)

    try {
      let tags = await fetch(
        `${siteURL}/wp-json/wp/v2/tags?page=1&per_page=40&include=${allTags}`
      ).then((res) => res.json())

      tags = tags.map(({ id, name }) => ({
        id,
        name,
      }))

      // console.log(tags)

      commit('updateTags', tags)
    } catch (err) {
      console.log(err)
    }
  },
}
