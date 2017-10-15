namespace forCrowd.WealthEconomy.WebApi
{
    using Newtonsoft.Json;
    using System.Net.Http.Formatting;

    public static class FormatterConfig
    {
        public static void RegisterFormatters(MediaTypeFormatterCollection formatters)
        {
            // Remove xml formatter (at least for the moment)
            formatters.Remove(formatters.XmlFormatter);

            // Json formatter
            formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            //formatters.JsonFormatter.Indent = true; ?
            //formatters.JsonFormatter.SerializerSettings.Converters.Add(new StringEnumConverter());
            //formatters.JsonFormatter.MaxDepth = 1;
        }
    }
}
