namespace VokaloApi.Models
{
    public class Glosa
    {
        public int Id { get; set; }
        public string Swedish { get; set; } = "";
        public string English { get; set; } = "";
        public string Child { get; set; } = ""; // username eller id på barnet
    }
}