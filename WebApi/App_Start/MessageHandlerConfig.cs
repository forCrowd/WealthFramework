namespace forCrowd.WealthEconomy.WebApi
{
    using Microsoft.AspNet.WebApi.Extensions.Compression.Server.Owin;
    using System.Collections.ObjectModel;
    using System.Net.Http;
    using System.Net.Http.Extensions.Compression.Core.Compressors;

    public static class MessageHandlerConfig
    {
        public static void RegisterMessageHandlerConfig(Collection<DelegatingHandler> messageHandlers)
        {
            // Compression
            var serverCompressionHandler = new OwinServerCompressionHandler(4096, new GZipCompressor(), new DeflateCompressor());
            messageHandlers.Insert(0, serverCompressionHandler);
        }
    }
}