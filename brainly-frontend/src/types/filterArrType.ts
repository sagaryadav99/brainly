export interface FilterArr {
  authorid: { _id: string; username: string };
  contenttype: string;
  link: string;
  summary: string;
  summaryStatus: string;
  tags: string[];
  title: string;
  __v: number;
  _id: string;
  note?: string;
}
