import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";

const BlogCard = ({ props }) => {

  return (
    <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
      <Card className="pt-5 border-1 border-slate-400">
        <CardContent className="">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={props.author.avatar || usericon}
                  alt="avatar"
                />
              </Avatar>
              <span className="text-sm font-semibold italic">{props.author.name}</span>
            </div>
            {props.author.role === "admin" && (
              <Badge variant="outline" className="bg-violet-500">
                Admin
              </Badge>
            )}
            {props.author.role === "user" && (
              <Badge variant="outline" className="bg-green-300">
                User
              </Badge>
            )}
          </div>

          <div className="my-2">
            <img
              src={props.featuredImage}
              alt="avatarino"
              className="rounded-md object-contain w-full h-48"
            />
          </div>
          <div className="">
            <p className="flex gap-2 items-center mb-2">
              <FaRegCalendarAlt />
              <span>{moment(props.createdAt).format("DD/MM/YYYY")}</span>
            </p>
            <h2 className="text-xl font-bold line-clamp-1">{props.title}</h2>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
