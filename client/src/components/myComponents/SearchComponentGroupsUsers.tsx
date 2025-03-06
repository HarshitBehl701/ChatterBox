import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { getImagePathUrl, handleCatchErrors} from "@/utils/commonUtils";
import { getGroupsList } from "@/api/groupApi";
import { getAllActiveUsers } from "@/api/userApi";
import { IGetAllActiveUsersResponse, IGetAllGroupsResponse } from "@/interfaces/apiInterfaces";
import { ISearchComponentGroupUsersParam } from "@/interfaces/componentInerface";
import { IGroupModal, IUserModal } from "@/interfaces/commonInterface";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

function SearchComponentGroupsUsers({ currentPage}:ISearchComponentGroupUsersParam) {
  const [query, setQuery] = useState("");
  const  [searchData,setSearchData] = useState<IUserModal[] | IGroupModal[]>([]);
  const [filteredSearchData, setFilteredSearchData] = useState<IUserModal[] | IGroupModal[]>([]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
      const value = e.target.value;
        setQuery(value);
    
        if (value.trim() === "") {
          setFilteredSearchData([]);
        } else {
          setFilteredSearchData(searchData.filter((obj) => obj.name.toLowerCase().includes(value.toLowerCase())) as IUserModal[] | IGroupModal[]);
        }
  },[searchData]);

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setFilteredSearchData([]);
  };

  const getSearchData  =  useCallback(async  ()  =>{
    try {
        const response  =   currentPage.includes("groups") ? await getGroupsList() : await getAllActiveUsers();

        if(response.status)
        {
            const responseData  = currentPage.includes("groups") ? (response.data  as IGetAllGroupsResponse).groups  :  (response.data  as IGetAllActiveUsersResponse).users;
            setSearchData(responseData);
        }else
            throw  new  Error(response.message);

    } catch (error) {
        throw  new Error(handleCatchErrors(error));
    }
  },[currentPage])

  return (
    <div className="relative w-1/3 shrink-0 min-w-[200px]">
      <Input
        placeholder={`Search ${currentPage}...`}
        className="w-full placeholder:capitalize"
        value={query}
        onChange={handleChange}
        onClick={getSearchData}
      />
      {filteredSearchData.length > 0 && (
        <div className="absolute left-0 mt-1 w-full bg-gray-800 border border-gray-300 rounded-md shadow-md z-10">
          {Array.isArray(filteredSearchData) &&  filteredSearchData.length > 0  && filteredSearchData.map((data, index) => (
            <Link to={`/${currentPage.includes("users") ? "user" :"group"}/${data.name}/details`} state={data} key={data._id}>
              <div className="twoSectionlayout flex items-center hover:bg-gray-900 cursor-pointer rounded-md  gap-1 p-2">
                <div className="rightSection">
                <Avatar>
                  <AvatarImage src={getImagePathUrl(currentPage.includes("groups")?'group':'user',data.picture)} className="cursor-pointer" />
                  <AvatarFallback>
                    <img src="https://github.com/shadcn.png" className="cursor-pointer" />
                  </AvatarFallback>
                </Avatar>
                </div>
                <div
                key={index}
                className="px-4 py-2"
                onClick={() => handleSelectSuggestion(data.name)}
              >
                {data.name}
              </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchComponentGroupsUsers;