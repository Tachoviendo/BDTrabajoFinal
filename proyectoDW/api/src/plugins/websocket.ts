import fastifyPlugin from "fastify-plugin";
import fastifyWebsocket from "@fastify/websocket";

export default fastifyPlugin(async function (fastify) {
  fastify.register(fastifyWebsocket, {
  });

  fastify.decorate(
    "notifyClient",
     function (id_usuario: number, data: any) {
      const socketUser = clientConnections.get(id_usuario);
      console.log({socketUser})
      if (!socketUser) return;

      const socket = socketUser.socket
      if (!socket) return;

      const message = JSON.stringify({ data });

      socket.send(message);
    }
  );
    fastify.decorate(
    "notifyAdmin",
    function (data: any) {
      clientConnections.forEach((conection, key)=>{
        console.log(key, "EKM   ")
        if(conection.isAdmin) fastify.notifyClient(key, data)
      })
    }
  );
  
});

declare module "fastify" {
  interface FastifyInstance {
    notifyClient(id_usuario: number, messageData: any): void;
    notifyAdmin(messageData: any): void;
  }
}

export const clientConnections = new Map<number, {isAdmin: boolean, socket: any} >()

