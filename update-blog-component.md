# Updating the Blog Component to Use Isolated WordPress Content

To prevent WordPress content from affecting your site's styling, update your `client/src/pages/blog.tsx` file with these changes:

## Step 1: Import the new isolated components

```jsx
import { fetchPostsSafely } from '../services/isolated-wordpress-api';
import IsolatedWordPressContent from '../components/ui/IsolatedWordPressContent';
```

## Step 2: Update the useEffect to use the safe fetch method

Replace the existing WordPress fetch code with:

```jsx
useEffect(() => {
  const loadPosts = async () => {
    try {
      setLoading(true);
      // Use the safe fetch method that includes fallback
      const fetchedPosts = await fetchPostsSafely({}, allBlogPosts);
      setPosts(fetchedPosts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load blog posts. Using fallback data.');
      setPosts(allBlogPosts);
    } finally {
      setLoading(false);
    }
  };
  
  loadPosts();
}, []);
```

## Step 3: Update the dialog content renderer

When displaying WordPress content in dialogs, use the isolated component. Find where you render the post content in the dialog and replace it with:

```jsx
{/* Replace the existing content renderer with this */}
<IsolatedWordPressContent 
  content={currentPost?.detailedContent?.content} 
  className="mt-4"
/>
```

## Step 4: Apply CSS fixes to isolate WordPress styles

Add this to your project's CSS (client/src/index.css or a new file):

```css
/* WordPress content isolation */
.wp-content-container {
  /* Prevent WordPress styles from leaking out */
  isolation: isolate;
  contain: content;
}

/* Override any problematic WordPress styles */
.wp-content-container img {
  max-width: 100%;
  height: auto;
}

/* Keep your site's fonts and text styling */
.wp-content-container h1, 
.wp-content-container h2, 
.wp-content-container h3, 
.wp-content-container h4, 
.wp-content-container h5, 
.wp-content-container h6,
.wp-content-container p,
.wp-content-container li {
  font-family: inherit;
  color: inherit;
}
```

## Testing Deployment

After making these changes:

1. Commit and push to your GitHub repository
2. Deploy to Vercel using the simplified build script we created
3. Check if the WordPress content is now properly isolated and doesn't affect your site's styling
