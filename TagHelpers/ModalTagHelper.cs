using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace DashboardSipega.TagHelpers
{
    [HtmlTargetElement("modal")]
    public class ModalTagHelper : TagHelper
    {
        public string Id { get; set; } = "customModal";
        public string Title { get; set; } = "";
        public string Size { get; set; } = "medium";
        public bool ShowClose { get; set; } = true;
        public bool ShowHeader { get; set; } = true;

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "div";
            output.Attributes.SetAttribute("class", "modal-overlay");
            output.Attributes.SetAttribute("id", Id);
            var childContent = await output.GetChildContentAsync();

            string closeButtonHtml = ShowClose
                ? $@"<button type=""button"" class=""modal-close"" onclick=""closeModal('{Id}')"" aria-label=""Close"">&times;</button>"
                : "";

            string headerHtml = ShowHeader
                ? $@"<div class=""modal-header"">
                        <h3>{Title}</h3>
                        {closeButtonHtml}
                    </div>"
                : "";

            output.Content.SetHtmlContent($@"
                <div class=""modal-container modal-{Size}"">
                    {headerHtml}
                    <div class=""modal-body"">
                        {childContent.GetContent()}
                    </div>
                </div>");
        }
    }
}
