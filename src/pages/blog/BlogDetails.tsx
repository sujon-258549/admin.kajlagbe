import { useParams, useNavigate } from "react-router";
import { Card, Tag, Divider, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faUser,
  faTag,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import { useSingleBlog } from "../../apihooks/useBlog";
import formatDate from "../../Components/utils/dateFormate";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blog, isLoading } = useSingleBlog(id || "");

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-500">Blog not found</h2>
        <CustomButton
          variant="primary"
          className="mt-4"
          onClick={() => navigate("/blog/list")}
        >
          Back to List
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Blog Management", path: "/blog/list" },
          { label: "Blog Details" },
        ]}
        title="Blog Details"
        extra={
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/blog/list")}
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            Back to List
          </CustomButton>
        }
      />

      <Card className="border-gray-200 overflow-hidden" bodyStyle={{ padding: 0 }}>
        {blog.cover?.url && (
          <div className="w-full h-80 overflow-hidden border-b border-gray-100">
            <img
              src={blog.cover.url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {blog.category && (
                <Tag color="blue" className="px-3 py-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faFolderOpen} className="text-[10px]" />
                  {blog.category}
                </Tag>
              )}
              {blog.isPublished ? (
                <Tag color="success">Published</Tag>
              ) : (
                <Tag color="warning">Draft</Tag>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  {blog.author?.profile?.photo ? (
                    <img
                      src={blog.author.profile.photo}
                      alt={blog.author.profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 leading-none mb-0.5">
                    {blog.author?.profile?.name || "Unknown Author"}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Author
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-primary/60" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>

          <Divider className="my-0" />

          {blog.description && (
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary/20 italic text-gray-600">
              {blog.description}
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none prose-slate"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
                <FontAwesomeIcon icon={faTag} className="text-primary" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <Tag key={tag} className="px-3 py-1 bg-gray-100 border-none rounded-full text-gray-600">
                    #{tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BlogDetails;
