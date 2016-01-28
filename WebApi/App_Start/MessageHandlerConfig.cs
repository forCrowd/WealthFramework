namespace forCrowd.WealthEconomy.WebApi
{
    using Microsoft.AspNet.WebApi.MessageHandlers.Compression;
    using Microsoft.AspNet.WebApi.MessageHandlers.Compression.Compressors;
    using System.Collections.ObjectModel;
    using System.Net.Http;

    public class MessageHandlerConfig
    {
        public static void RegisterMessageHandlerConfig(Collection<DelegatingHandler> messageHandlers)
        {
            // Compression
            var serverCompressionHandler = new ServerCompressionHandler(4096, new GZipCompressor(), new DeflateCompressor());
            var clientCompressionHandler = new ClientCompressionHandler(4096, new GZipCompressor(), new DeflateCompressor());
            messageHandlers.Insert(0, new ServerCompressionHandler(new GZipCompressor(), new DeflateCompressor()));
        }
    }
}