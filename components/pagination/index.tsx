import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import { useTranslate } from "../../commonModules/translate";

type Props = {
  onPageChange: (page: number) => void;
  totalRecords: number;
  pageSize?: number;
  currentPage?: number;
};

export const PageSizeConstant = 15;

const PaginationComp: React.FC<Props> = (props) => {
  const t=useTranslate()
  const { onPageChange, totalRecords, pageSize, currentPage } = props;
  const totalNoOfPages = Math.ceil(
    totalRecords / (pageSize ? pageSize : PageSizeConstant)
  );
  const [currentPageNo, setCurrentPageNo] = useState<number>(1);

  useEffect(() => {
    if (currentPage) {
      setCurrentPageNo(currentPage);
    }
  }, [currentPage]);

  let newItems: any[] = [];
  newItems.push(
    <Pagination.Item
      key={`pagination-item-${1}`}
      active={currentPageNo === 1}
      onClick={() => {
        onPageChange(1);
        setCurrentPageNo(1);
      }}
    >
      {1}
    </Pagination.Item>
  );
  for (let index = 2; index < totalNoOfPages; index++) {
    if (currentPageNo - index === 3) {
      newItems.push(<Pagination.Ellipsis />);
    } else if (index - 3 === currentPageNo) {
      newItems.push(<Pagination.Ellipsis />);
    } else if (index < currentPageNo + 3 && currentPageNo < index + 3) {
      newItems.push(
        <Pagination.Item
          key={`pagination-item-${index}`}
          active={currentPageNo === index}
          onClick={() => {
            onPageChange(index);
            setCurrentPageNo(index);
          }}
        >
          {index}
        </Pagination.Item>
      );
    }
  }
  newItems.push(
    <Pagination.Item
      key={`pagination-item-${totalNoOfPages}`}
      active={currentPageNo === totalNoOfPages}
      onClick={() => {
        onPageChange(totalNoOfPages);
        setCurrentPageNo(totalNoOfPages);
      }}
    >
      {totalNoOfPages}
    </Pagination.Item>
  );
  return (
    <div className="my-3 d-flex justify-content-between paginationlist-cover">
      <div className="px-3">
        {t("showing")}{" "}
        {(currentPageNo - 1) * (pageSize ? pageSize : PageSizeConstant) + 1} {t("to")}{" "}
        {currentPageNo * (pageSize ? pageSize : PageSizeConstant) > totalRecords
          ? totalRecords
          : currentPageNo * (pageSize ? pageSize : PageSizeConstant)}{" "}
        {t("of")} {totalRecords} {t("entries")}
      </div>

      <Pagination>
        <Pagination.First
          disabled={currentPageNo === 1}
          onClick={() => {
            onPageChange(1);
            setCurrentPageNo(1);
          }}
        />
        <Pagination.Prev
          disabled={currentPageNo === 1}
          onClick={() => {
            onPageChange(currentPageNo - 1);
            setCurrentPageNo(currentPageNo - 1);
          }}
        />
        {newItems}
        <Pagination.Next
          disabled={currentPageNo === totalNoOfPages}
          onClick={() => {
            onPageChange(currentPageNo + 1);
            setCurrentPageNo(currentPageNo + 1);
          }}
        />
        <Pagination.Last
          disabled={currentPageNo === totalNoOfPages}
          onClick={() => {
            onPageChange(totalNoOfPages);
            setCurrentPageNo(totalNoOfPages);
          }}
        />
      </Pagination>
    </div>
  );
};

export default PaginationComp;
